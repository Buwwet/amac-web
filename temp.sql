-- =========================================================
-- TABLAS
-- =========================================================
-- Un perfil por cada usuario de Supabase Auth (candidato, empresa o admin)
create table public.perfiles (
id uuid primary key references auth.users (id) on delete cascade,
rol text not null default 'candidato'
check (rol in ('candidato', 'empresa', 'admin')),
nombre text not null,
telefono text,
edad int check (edad between 18 and 120),
colonia text,
experiencia text,
giro text, -- solo empresas
aprobado boolean not null default false, -- RF-054: lo cambia AMAC
creado_en timestamptz not null default now(),
img_url text
);
create table public.vacantes (
id bigint generated always as identity primary key,
empresa_id uuid not null references public.perfiles (id) on delete cascade,
titulo text not null,
sueldo numeric(10,2) not null check (sueldo > 0),
ubicacion text not null,
horario text not null
check (horario in ('Matutino', 'Vespertino', 'Medio tiempo', 'Fines de
semana')),
categoria text not null,
descripcion text not null,
requisitos text not null,
prestaciones text not null,
telefono_contacto text, -- null = solo postulaciones por la plataforma (RF-

estado text not null default 'activa'
check (estado in ('activa', 'pausada', 'cerrada')),
creada_en timestamptz not null default now(),

img_url text
);
create table public.solicitudes (
id bigint generated always as identity primary key,
vacante_id bigint not null references public.vacantes (id) on delete cascade,
candidato_id uuid not null references public.perfiles (id) on delete cascade,
estatus text not null default 'Enviada'
check (estatus in ('Enviada', 'En revisión', 'Aceptada', 'Rechazada',
'Cancelada')),
creada_en timestamptz not null default now(),
unique (vacante_id, candidato_id) -- RF-004: no aplicar dos veces
);
-- =========================================================
-- CREAR EL PERFIL AUTOMÁTICAMENTE AL REGISTRARSE
-- (los datos llegan en options.data de supabase.auth.signUp)
-- =========================================================
create function public.crear_perfil()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
insert into public.perfiles (id, rol, nombre, telefono, edad, colonia, experiencia, giro)
values (
new.id,
case when new.raw_user_meta_data->>'rol' = 'empresa' then 'empresa' else 'candidato' end,
coalesce(new.raw_user_meta_data->>'nombre', 'Sin nombre'),
new.raw_user_meta_data->>'telefono',
nullif(new.raw_user_meta_data->>'edad', '')::int,
new.raw_user_meta_data->>'colonia',
new.raw_user_meta_data->>'experiencia',
new.raw_user_meta_data->>'giro'
);
return new;
end;
$$;
create trigger al_crear_usuario
after insert on auth.users
for each row execute function public.crear_perfil();
-- =========================================================
-- FUNCIONES AUXILIARES PARA LAS POLÍTICAS
-- (security definer evita que las políticas se llamen entre sí en bucle)
-- =========================================================
create function public.mi_rol()
returns text language sql stable security definer set search_path = '' as $$
select rol from public.perfiles where id = auth.uid()
$$;
create function public.candidato_aprobado()
returns boolean language sql stable security definer set search_path = '' as $$
select exists (
select 1 from public.perfiles
where id = auth.uid() and rol = 'candidato' and aprobado
)
$$;
create function public.candidato_aplico(vid bigint)
returns boolean language sql stable security definer set search_path = '' as $$
select exists (
select 1 from public.solicitudes
where vacante_id = vid and candidato_id = auth.uid()
)
$$;
create function public.empresa_ve_candidato(cid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
select exists (
select 1
from public.solicitudes s
join public.vacantes v on v.id = s.vacante_id
where s.candidato_id = cid and v.empresa_id = auth.uid()
)
$$;
-- =========================================================
-- SEGURIDAD POR FILA (RLS) — RF-010
-- =========================================================
alter table public.perfiles enable row level security;
alter table public.vacantes enable row level security;
alter table public.solicitudes enable row level security;
-- PERFILES
create policy "Cada quien ve su perfil" on public.perfiles
for select using (id = auth.uid());
create policy "Todos ven los perfiles de empresas" on public.perfiles
for select using (rol = 'empresa');
create policy "La empresa ve a quien aplicó a sus vacantes" on public.perfiles
for select using (public.empresa_ve_candidato(id));
create policy "Cada quien edita su perfil" on public.perfiles
for update using (id = auth.uid()) with check (id = auth.uid());
-- Nadie puede cambiarse a sí mismo el rol ni el campo "aprobado"
revoke update on public.perfiles from anon, authenticated;
grant update (nombre, telefono, edad, colonia, experiencia, giro)
on public.perfiles to authenticated;
-- VACANTES
create policy "Ver vacantes activas o las propias" on public.vacantes
for select using (estado = 'activa' or empresa_id = auth.uid());
create policy "El candidato sigue viendo las vacantes a las que aplicó" on public.vacantes
for select using (public.candidato_aplico(id)); -- RF-021: aunque se pausen
create policy "Solo empresas publican, a su nombre" on public.vacantes
for insert with check (empresa_id = auth.uid() and public.mi_rol() = 'empresa');
create policy "La empresa edita sus vacantes" on public.vacantes
for update using (empresa_id = auth.uid()) with check (empresa_id = auth.uid());
-- SOLICITUDES
create policy "Candidato ve las suyas; empresa ve las de sus vacantes" on public.solicitudes
for select using (
candidato_id = auth.uid()
or exists (select 1 from public.vacantes v
where v.id = vacante_id and v.empresa_id = auth.uid())
);
create policy "Solo candidatos aprobados se postulan" on public.solicitudes
for insert with check (
candidato_id = auth.uid()
and estatus = 'Enviada'
and public.candidato_aprobado()
);
create policy "Candidato cancela si no está resuelta" on public.solicitudes
for update
using (candidato_id = auth.uid() and estatus in ('Enviada', 'En revisión'))
with check (candidato_id = auth.uid() and estatus = 'Cancelada');
create policy "Empresa cambia el estatus" on public.solicitudes
for update
using (
estatus <> 'Cancelada'
and exists (select 1 from public.vacantes v
where v.id = vacante_id and v.empresa_id = auth.uid())
)
with check (
estatus in ('En revisión', 'Aceptada', 'Rechazada')
and exists (select 1 from public.vacantes v
where v.id = vacante_id and v.empresa_id = auth.uid())
);
-- De una solicitud solo se puede modificar el estatus
revoke update on public.solicitudes from anon, authenticated;
grant update (estatus) on public.solicitudes to authenticated;
import type { TipoMeta } from "../types";
import { MapPinIcon, CalendarDaysIcon, UsersIcon } from "@heroicons/react/24/outline";

export const ICONE_META: Record<TipoMeta, typeof MapPinIcon> = {
  distancia: MapPinIcon,
  data: CalendarDaysIcon,
  popularidade: UsersIcon,
};

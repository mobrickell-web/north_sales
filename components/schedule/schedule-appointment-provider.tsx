"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { ScheduleAppointmentDialog } from "@/components/schedule/schedule-appointment-dialog";

type ScheduleAppointmentContextValue = {
  open: boolean;
  openSchedule: () => void;
  closeSchedule: () => void;
};

const ScheduleAppointmentContext =
  createContext<ScheduleAppointmentContextValue | null>(null);

export function ScheduleAppointmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openSchedule = useCallback(() => setOpen(true), []);
  const closeSchedule = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openSchedule, closeSchedule }),
    [open, openSchedule, closeSchedule],
  );

  return (
    <ScheduleAppointmentContext.Provider value={value}>
      {children}
      <ScheduleAppointmentDialog
        open={open}
        onOpenChange={(next) => (next ? openSchedule() : closeSchedule())}
      />
    </ScheduleAppointmentContext.Provider>
  );
}

export function useScheduleAppointment() {
  const context = useContext(ScheduleAppointmentContext);
  if (!context) {
    throw new Error(
      "useScheduleAppointment must be used within ScheduleAppointmentProvider",
    );
  }
  return context;
}

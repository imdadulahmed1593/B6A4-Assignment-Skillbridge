"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { tutorApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiChevronLeft, FiPlus, FiTrash2, FiClock } from "react-icons/fi";
import { TutorAvailability } from "@/types";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function TutorAvailabilityPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [availabilities, setAvailabilities] = useState<TutorAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/login");
      } else if (session.user.role !== "TUTOR") {
        toast.error("Access denied. Tutor account required.");
        router.push("/dashboard");
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user?.role === "TUTOR") {
      fetchAvailabilities();
    }
  }, [session]);

  const fetchAvailabilities = async () => {
    try {
      const response = await tutorApi.getMyAvailability();
      setAvailabilities(response.data || []);
    } catch (error) {
      console.error("Failed to fetch availabilities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSlot.startTime >= newSlot.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setIsSaving(true);
    try {
      await tutorApi.addAvailability(newSlot);
      toast.success("Availability added successfully!");
      setShowAddForm(false);
      setNewSlot({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });
      fetchAvailabilities();
    } catch (error: any) {
      toast.error(error.message || "Failed to add availability");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure you want to remove this availability slot?")) return;

    try {
      await tutorApi.deleteAvailability(slotId);
      toast.success("Availability removed");
      fetchAvailabilities();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove availability");
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-secondary-200 rounded w-48 mb-8" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-secondary-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "TUTOR") return null;

  // Group availabilities by day
  const groupedByDay = DAYS.map((day) => ({
    ...day,
    slots: availabilities.filter((a) => a.dayOfWeek === day.value),
  }));

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/tutor/dashboard" className="text-secondary-600 hover:text-primary-600">
              <FiChevronLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-secondary-900">Availability</h1>
              <p className="text-secondary-600">Set your available hours for tutoring</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Add Slot
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="card p-6 mb-6">
              <h3 className="font-semibold text-secondary-900 mb-4">Add Availability Slot</h3>
              <form onSubmit={handleAddSlot} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Day
                    </label>
                    <select
                      value={newSlot.dayOfWeek}
                      onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: Number(e.target.value) })}
                      className="input-field w-full"
                    >
                      {DAYS.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="input-field w-full"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Add Slot"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Availability List */}
          <div className="card overflow-hidden">
            {availabilities.length === 0 ? (
              <div className="p-12 text-center">
                <FiClock className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  No availability set
                </h3>
                <p className="text-secondary-600 mb-6">
                  Add your available hours so students can book sessions with you.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  Add Availability
                </button>
              </div>
            ) : (
              <div className="divide-y divide-secondary-100">
                {groupedByDay
                  .filter((day) => day.slots.length > 0)
                  .map((day) => (
                    <div key={day.value} className="p-4">
                      <h3 className="font-semibold text-secondary-900 mb-3">
                        {day.label}
                      </h3>
                      <div className="space-y-2">
                        {day.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between bg-secondary-50 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <FiClock className="text-primary-600" />
                              <span className="text-secondary-700">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Set multiple slots for the same day if you have breaks</li>
              <li>• Students can only book during your available hours</li>
              <li>• Update your availability regularly to get more bookings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

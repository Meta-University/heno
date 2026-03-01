import { API_BASE } from "./config";

export async function reorganiseSchedule(schedule) {
  try {
    const response = await fetch(`${API_BASE}/reorganise-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        schedule,
      }),
      credentials: "include",
    });
    const data = await response.json();
    return [data.resolvedSchedule, data.changes];
  } catch (error) {
    console.error(error);
  }
}

import { API_BASE } from "./config";

export async function reorganiseSchedule(schedule) {
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

  let data = {};
  try {
    data = await response.json();
  } catch {
    /* non-JSON body */
  }

  if (!response.ok) {
    const err = new Error(
      data.error || `Schedule reorganisation failed (${response.status})`
    );
    err.status = response.status;
    throw err;
  }

  return [data.resolvedSchedule, data.changes];
}

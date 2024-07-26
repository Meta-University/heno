export async function reorganiseSchedule(schedule) {
  try {
    const response = await fetch("http://localhost:3000/reorganise-schedule", {
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

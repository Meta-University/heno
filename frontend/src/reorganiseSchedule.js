export async function reorganiseSchedule(schedule) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/reorganise-schedule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schedule,
        }),
        credentials: "include",
      }
    );
    const data = await response.json();
    return [data.resolvedSchedule, data.changes];
  } catch (error) {
    console.log(error);
  }
}

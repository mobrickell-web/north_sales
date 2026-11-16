const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function downloadClientReport(reportId: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/v1/client/reports/${encodeURIComponent(reportId)}/download`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const message =
      response.status === 401 || response.status === 403
        ? "You are not allowed to download this report."
        : `Download failed (HTTP ${response.status}).`;
    throw new Error(message);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") ?? "";
  const matched = /filename="([^"]+)"/i.exec(disposition);
  const fileName = matched?.[1] || `report-${reportId}`;

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

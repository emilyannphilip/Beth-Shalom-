import { PortalDataStatus } from "./portal-session";
import type { Enquiry } from "./models";
import { childrenSupportSource } from "../public/enquiry-api";

export function EnquiryHistory({
  record,
  loading,
  error,
}: {
  record: Enquiry | null;
  loading?: boolean;
  error?: string;
}) {
  return (
    <section className="my-4 space-y-2" aria-label="Enquiry history">
      <PortalDataStatus loading={loading} error={error} />
      {record?.source && (
        <p className="text-body-sm">
          Source{" "}
          {record.source === childrenSupportSource
            ? "Home page"
            : record.source.replaceAll("_", " ").toLowerCase()}{" "}
          · {record.originalTopic}
        </p>
      )}
      {record?.childAge !== undefined && (
        <p className="text-body-sm">Child’s age {record.childAge}</p>
      )}
      {record?.supportRequirements && (
        <div className="text-body-sm">
          <h3 className="font-semibold">Care and support requirements</h3>
          <p className="whitespace-pre-line">{record.supportRequirements}</p>
        </div>
      )}
      <h3 className="font-semibold">Follow-up history</h3>
      {record?.audit?.length ? (
        <ul className="space-y-2">
          {[...record.audit].reverse().map((entry, index) => (
            <li key={entry.time + index} className="text-body-sm">
              <time>{new Date(entry.time).toLocaleString()}</time> ·{" "}
              {entry.role} · {entry.status}
              {entry.remarks ? " · " + entry.remarks : ""}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="text-body-sm">No follow-ups recorded.</p>
      )}
    </section>
  );
}

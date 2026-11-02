import type { Metadata } from "next";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EditStudioLoader } from "@/components/account/edit-studio-loader";

export const metadata: Metadata = {
  title: "Update Studio",
  description: "Edit an existing studio listing on StudioSpace.",
};

/**
 * The id is read client-side by EditStudioLoader (only GET /mine exists), so
 * this wrapper just waits for the awaited route params and passes them down.
 */
async function EditStudioFromParams({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditStudioLoader id={id} />;
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <ProtectedRoute>
        <EditStudioFromParams params={params} />
      </ProtectedRoute>
    </div>
  );
}

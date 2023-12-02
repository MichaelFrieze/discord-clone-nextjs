import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { InitialModal } from '@/components/modals/initial-modal';

const SetupPage = async () => {
  const profile = await initialProfile();
  let publicInviteCode = '6fe8b4de-dd3d-4a0e-85fe-b5ff801e4cd9';

  const existingServer = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: publicInviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;

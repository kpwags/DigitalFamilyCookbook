import Link from 'next/link';
import { AuthGateway } from '../components/AuthGateway/AuthGateway';

const Account = () => (
    <>
        <AuthGateway redirectUrl="/account" permissionNeeded="USER">
            <h1>Account Settings</h1>
            <p>
                <Link href="/change-password">
                    <a>Change Password</a>
                </Link>
            </p>
        </AuthGateway>
    </>
);

export default Account;

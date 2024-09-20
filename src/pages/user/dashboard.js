import {Link} from "react-router-dom";
import Button from '@mui/material/Button';

export default function UserDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      
      <div className="space-y-4">
        <Link href="/user/voting">
          <Button variant="contained" color="primary">
            Go to Voting
          </Button>
        </Link>
        {/* Add other dashboard options like viewing results, etc. */}
        <Button variant="outlined" color="secondary">
          View Election Results
        </Button>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsersAuth } from "@/store/auth-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userDetails || userDetails.length === 0) {
      dispatch(getAllUsersAuth());
    }
  }, [dispatch]); // ✅ Not including userDetails

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(userDetails) &&
          userDetails.slice(0, 5).map((user) => (
            <TableRow key={user?._id || Math.random()}>
              <TableCell className="font-medium">
                {user?._id?.substring(0, 8) || "N/A"}...
              </TableCell>
              <TableCell>{user?.userName || "Unknown"}</TableCell>
              <TableCell>{user?.email || "N/A"}</TableCell>
              <TableCell>
                <Badge
                  variant={user?.role === "admin" ? "destructive" : "default"}
                >
                  {user?.role || "user"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

import { Button, CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { UsersTable } from "../../components/UsersTable/UsersTable";
import { getUsers, User } from "../../services/authentication";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Error } from "../../components/Error/Error";

export const UsersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { isInGroup } = useAuth();

  const toCreateUser = () => navigate("/users/create");

  useEffect(() => {
    if (loading) {
      getUsers().then((users) => {
        setLoading(false);
        setUsers(users);
      });
    }
  }, [loading, setUsers, setLoading]);
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Users
      </Typography>
      {isInGroup("Admin") ? (
        <>
          <Button startIcon={<AddIcon />} onClick={toCreateUser}>
            New user
          </Button>
          {loading ? <CircularProgress /> : <UsersTable users={users} />}
        </>
      ) : (
        <Error code="UNAUTHORIZED" />
      )}
    </>
  );
};

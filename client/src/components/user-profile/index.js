import React from "react";
import { Card } from "antd";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { auth } from "../../_actions/user_actions";

function UserProfile() {
  const dispatch = useDispatch();
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  React.useEffect(() => {
    dispatch(auth()).then((response) => {
      setName(`${response.payload.firstName} ${response.payload.lastName}`);
      setRole(response.payload.role);
    });
  }, [dispatch]);
  return (
    <Card
      style={{
        textAlign: "center",
      }}
      cover={
        <div style={{ marginTop: "5%" }}>
          <Avatar size={64} icon={<UserOutlined />} />
        </div>
      }
    >
      <Card.Meta title={name} description={role} />
    </Card>
  );
}

export default UserProfile;

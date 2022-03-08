import React from "react";
import { Layout } from "antd";
import UserProfile from "../user-profile";
import SideMenu from "../side-menu";
function Sider() {
  return (
    <Layout.Sider theme="light">
      <UserProfile />
      <SideMenu />
    </Layout.Sider>
  );
}

export default Sider;

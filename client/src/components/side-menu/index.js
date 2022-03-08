import React from "react";
import {
  DashboardFilled,
  SettingFilled,
  BankFilled,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

function SideMenu() {
  var parts = window.location.href.split("/");
  var lastSegment = parts.pop() || parts.pop();
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[lastSegment]}
      style={{ height: "100%", borderRight: 0 }}
    >
      <Menu.Item
        onClick={(info) => (window.location.href = `/${info.key}`)}
        icon={<DashboardFilled />}
        key=""
      >
        Dashboard
      </Menu.Item>
      <Menu.Item
        onClick={(info) => (window.location.href = `/${info.key}`)}
        icon={<UserSwitchOutlined />}
        key="users"
      >
        Users
      </Menu.Item>
      <Menu.Item
        onClick={(info) => (window.location.href = `/${info.key}`)}
        key="colleges"
      >
        Colleges
      </Menu.Item>
      <Menu.Item
        onClick={(info) => (window.location.href = `/${info.key}`)}
        icon={<BankFilled />}
        key="departments"
      >
        Departments
      </Menu.Item>
      <Menu.Item
        onClick={(info) => (window.location.href = `/${info.key}`)}
        icon={<BankFilled />}
        key="Commitees"
      >
        Commitees
      </Menu.Item>
      <Menu.Item
        onClick={(info) => (window.location.href = `/${info.key}`)}
        icon={<BankFilled />}
        key="meetings"
      >
        Meetings
      </Menu.Item>
      <Menu.Item
        onClick={(info) => (window.location.href = `/${info.key}`)}
        icon={<SettingFilled />}
        key="settings"
      >
        Settings
      </Menu.Item>
    </Menu>
  );
}

export default SideMenu;

import React from "react";
import { BankFilled, UserOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Statistic, Row, Col } from "antd";
import { Table } from "antd";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import MainLayout from "../components/layout";
import { departments } from "../_actions/department_actions";
import { useDispatch } from "react-redux";

const columns = [
  {
    title: "No",
    dataIndex: "key",
    key: "key",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Building",
    dataIndex: "building",
    key: "building",
  },
  {
    title: "College",
    dataIndex: "college",
    key: "college",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    building: "A",
    college: "Computer science",
  },
];
const chartData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function LandingPage() {
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      dispatch(
        departments({ page: pagination.current, limit: pagination.pageSize })
      )
        .then((res) => {
          setLoading(false);
          setData(res.payload.departments);
        })
        .catch((err) => {
          setLoading(false);
        });
    }, 500);

    return () => {};
  }, [pagination, dispatch]);
  return (
    <MainLayout>
      <Row gutter={8}>
        <Col span={8}>
          <Card bordered>
            <Statistic
              title="Total of Users"
              value={20}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total of Colleges"
              value={6}
              prefix={<BankFilled />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total of Department"
              value={13}
              prefix={<BankFilled />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={16}>
          <Table
            title={(p) => <h3>latest departments</h3>}
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
          />
        </Col>
        <Col span={8}>
          <Card
            style={{ height: "100%", width: "100%" }}
            bodyStyle={{ height: "100%" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={30}
                  fill="#8884d8"
                  outerRadius={40}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
}

export default LandingPage;

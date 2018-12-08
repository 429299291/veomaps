import { connect } from "dva";
import { PureComponent } from "react";
import Role from "./Role";
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Select,
  Card,
  message
} from "antd";
import React from "react";
import UrlToPrivilege from "./UrlToPrivilege";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ roles, privileges, loading }) => ({
  roles,
  privileges,
  loading: loading.models.roles && loading.models.privileges
}))
@Form.create()
class Privilege extends PureComponent {
  state = {
    selectedRoleId: null,
    selectedRolePrivileges: null,
    checkBoxState: {}
  };

  componentDidMount() {
    this.handleGetRoles();
    this.handleGetPrivileges();
  }

  handleGetRoles = () => {
    const { dispatch } = this.props;

    dispatch({
      type: "roles/get",
      payload: {}
    });
  };

  handleGetPrivileges = () => {
    const { dispatch } = this.props;

    dispatch({
      type: "privileges/get",
      payload: {}
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;

        const roleId = values.roleId;

        delete values.roleId;

        const validPrivilegeIds = Object.keys(values).filter(
          key => values[key]
        );

        console.log(roleId);

        console.log(validPrivilegeIds);

        // dispatch({
        //   type: "privileges/updateRolePrivileges",
        //   roleId: values.roleId,
        //   privilegeIds: validPrivilegeIds
        // });

        //console.log('Received values of form: ', values);
      }
    });
  };

  handleRoleChange = roleId => {
    const { roles } = this.props;
    const role = roles.data.filter(role => role.id === roleId)[0];

    const privileges = role.privileges;

    const selectedRolePrivileges =
      role.privileges !== null
        ? role.privileges.reduce((result, privilege) => {
            result[`${privilege.method} ${privilege.url}`] = privilege;
            return result;
          }, {})
        : [];

    this.setState({
      selectedRoleId: roleId,
      selectedRolePrivileges: selectedRolePrivileges
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const { roles, privileges } = this.props;

    const { selectedRoleId, selectedRolePrivileges } = this.state;

    return (
      <PageHeaderWrapper title="Privilege List">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator("roleId", {
                rules: [{ required: true, message: "Please select a role!" }],
                onChange: roleId =>
                  this.setState(
                    { selectedRoleId: null, selectedRolePrivileges: null },
                    () => this.handleRoleChange(roleId)
                  )
              })(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {roles.data.map(role => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            {selectedRolePrivileges &&
              Object.keys(UrlToPrivilege).map(groupName => {
                const group = [];

                let isAllChecked = true;

                const fieldsValue = this.props.form.getFieldsValue();

                const configs = Object.keys(UrlToPrivilege[groupName]).map(
                  url => {
                    const isRoleHasPrivilege = !!selectedRolePrivileges[url];
                    const privilegeDetail = this.props.privileges.data.filter(
                      p => url === `${p.method} ${p.url}`
                    )[0];

                    isAllChecked = isAllChecked && isRoleHasPrivilege;

                    if (!privilegeDetail) {
                      message.error(url + "is wrong in UrlToPrivilege!");
                    }

                    group.push(privilegeDetail.id);
                    return {
                      privilegeId: privilegeDetail.id,
                      initialValue: isRoleHasPrivilege,
                      name: UrlToPrivilege[groupName][url]
                    };
                  }
                );

                const isCheckboxTouched =
                  Object.keys(fieldsValue).filter(key => group.includes(key))
                    .length === group.length;

                if (isCheckboxTouched) {
                  isAllChecked = group.reduce(
                    (result, key) => result && !!fieldsValue[key],
                    true
                  );
                }

                return (
                  <Card
                    key={groupName}
                    style={{ marginBottom: "1em" }}
                    title={
                      <Checkbox
                        onChange={e =>
                          group.map(id => {
                            const fieldValue = {};
                            fieldValue[id] = e.target.checked;
                            this.props.form.setFieldsValue(fieldValue);
                          })
                        }
                        checked={isAllChecked}
                      >
                        {groupName}
                      </Checkbox>
                    }
                  >
                    {configs.map(config => {
                      const { name, privilegeId, initialValue } = config;

                      return (
                        <FormItem
                          key={privilegeId}
                          style={{ marginBottom: "0.5em", marginLeft: "2em" }}
                        >
                          {getFieldDecorator(privilegeId + "", {
                            valuePropName: "checked",
                            initialValue: initialValue
                          })(<Checkbox>{name}</Checkbox>)}
                        </FormItem>
                      );
                    })}
                  </Card>
                );
              })}
            <FormItem>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Privilege;

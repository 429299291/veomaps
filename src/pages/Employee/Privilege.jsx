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
    checkBoxState: {} //{groupName: {"method url": {isChecked: true/false, id: number}}}}
  };

  componentDidMount() {
    this.handleGetRoles();
    this.handleGetPrivileges();
  }

  handleGetRoles = onSuccess => {
    const { dispatch } = this.props;

    dispatch({
      type: "roles/get",
      payload: {},
      onSuccess: onSuccess
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
    const { checkBoxState } = this.state;

    const { dispatch } = this.props;

    const privilegeIds = [];

    const hash = {};

    Object.keys(checkBoxState).map(groupName => {
      Object.keys(checkBoxState[groupName]).map(url => {
        const isChecked = checkBoxState[groupName][url].isChecked;
        const privilegeId = checkBoxState[groupName][url].id;

        if (isChecked && !hash[privilegeId]) {
          privilegeIds.push(privilegeId);
          hash[privilegeId] = true;
        }
      });
    });

    console.log(privilegeIds);

    dispatch({
      type: "privileges/updateRolePrivileges",
      roleId: this.state.selectedRoleId,
      privilegeIds: privilegeIds,
      onSuccess: () =>
        this.handleGetRoles(roles =>
          this.handleRoleChange(this.state.selectedRoleId, roles)
        )
    });
  };

  handleRoleChange = (roleId, roles) => {
    const role = roles.filter(role => role.id === roleId)[0];

    const privileges = role.privileges;

    const selectedRolePrivileges =
      role.privileges !== null
        ? role.privileges.reduce((result, privilege) => {
            result[`${privilege.method} ${privilege.url}`] = privilege;
            return result;
          }, {})
        : {};

    const urlToPrivilegeIds = this.props.privileges.data.reduce(
      (result, privilege) => {
        result[`${privilege.method} ${privilege.url}`] = privilege.id;
        return result;
      },
      {}
    );

    const checkBoxState = {};

    Object.keys(UrlToPrivilege).map(groupName => {
      checkBoxState[groupName] = {};
      Object.keys(UrlToPrivilege[groupName]).map(url => {
        checkBoxState[groupName][url] = {
          isChecked: !!selectedRolePrivileges[url],
          id: urlToPrivilegeIds[url]
        };
      });
    });

    this.setState({
      selectedRoleId: roleId,
      selectedRolePrivileges: selectedRolePrivileges,
      checkBoxState: checkBoxState
    });
  };

  handleGroupCheckBoxChange = (isChecked, groupName) => {
    const groupDetail = this.state.checkBoxState[groupName];

    if (groupDetail) {
      //change all checkbox in group to value of group checkbox
      Object.keys(groupDetail).map(
        key => (groupDetail[key].isChecked = isChecked)
      );

      //reset group state

      const newCheckBoxState = Object.assign({}, this.state.checkBoxState);

      this.setState(prevState => ({
        ...prevState,
        checkBoxState: newCheckBoxState
      }));
    }
  };

  handleSubPrivilegeCheckBoxChange = (value, groupName, url) => {
    const checkBoxState = Object.assign({}, this.state.checkBoxState);

    checkBoxState[groupName][url].isChecked = value;

    this.setState({ checkBoxState: checkBoxState });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const { roles, privileges } = this.props;

    const {
      selectedRoleId,
      selectedRolePrivileges,
      checkBoxState
    } = this.state;

    return (
      <PageHeaderWrapper title="Privilege List">
        <Card bordered={false}>
          <Select
            placeholder="select"
            style={{ width: "100%" }}
            onChange={value =>
              this.handleRoleChange(value, this.props.roles.data)
            }
          >
            {roles.data.map(role => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>

          {selectedRolePrivileges &&
            Object.keys(checkBoxState).map(groupName => {
              return (
                <Card
                  key={groupName}
                  style={{ marginBottom: "1em" }}
                  title={
                    <Checkbox
                      onChange={e =>
                        this.handleGroupCheckBoxChange(
                          e.target.checked,
                          groupName
                        )
                      }
                      checked={Object.keys(checkBoxState[groupName]).reduce(
                        (result, key) =>
                          checkBoxState[groupName][key].isChecked && result,
                        true
                      )}
                    >
                      {groupName}
                    </Checkbox>
                  }
                >
                  {Object.keys(checkBoxState[groupName]).map(url => {
                    const name = UrlToPrivilege[groupName][url];

                    const checked = checkBoxState[groupName][url].isChecked;

                    return (
                      <Checkbox
                        key={checkBoxState[groupName][url].id}
                        checked={checked}
                        onChange={e =>
                          this.handleSubPrivilegeCheckBoxChange(
                            e.target.checked,
                            groupName,
                            url
                          )
                        }
                      >
                        {name}
                      </Checkbox>
                    );
                  })}
                </Card>
              );
            })}
          <FormItem>
            <Button onClick={this.handleSubmit}>Save</Button>
          </FormItem>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Privilege;

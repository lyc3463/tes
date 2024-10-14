import {Button, Input, List, Select, Space} from "antd";

const WaterStatistics=()=>{
    return(
        <div>
            <List>
                <List.Item>
                    {/*<div>*/}
                    {/*    <Button type="primary">*/}
                    {/*        创建收费项目*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                    <Space>
                        <Input
                            addonBefore="收费项目名称:"
                        />
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                收费类型:
                            </div>
                            <Select
                                defaultValue="255"
                                style={{ width: 120 }}
                                options={[
                                    { value: '255', label: '全部' },
                                    { value: '1', label: '周期收费' },
                                    { value: '2', label: '一次性收费' },
                                    { value: '3', label: '押金类收费' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary">
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
        </div>
    )
}
export default WaterStatistics
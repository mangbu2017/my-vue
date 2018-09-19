<template>
    <i-form
        v-timely-validate
        ref="iForm"
        :model="form"
        :rules="rules"
        :label-width="80"
        class="content-wrap form"
        @submit.native.prevent="handleSubmit"
    >
        <div class="page-title">
            <h2>创建实例</h2>
            <i-button
                v-if="loading === 'failure'"
                type="error"
                class="btn-error"
                @click.prevent="handleRefresh"
            >发生错误，点击刷新</i-button>

            <i-button
                v-try-back="{path: '/ecs-seabed/:page(\\d+)?/:keyword?', fallback: '/ecs-seabed'}"
                type="primary"
                class="return-list"
            >返回实例列表</i-button>
        </div>
        <i-card title="基础配置" class="card">
            <i-form-item label="地域" prop="areaID">
                <i-radio-group
                    v-model="form.areaID"
                    type="button"
                >
                    <i-radio
                        v-for="item in arealist"
                        :key="item.areaID"
                        :label="item.areaID"
                    >{{ item.region }}</i-radio>
                </i-radio-group>
            </i-form-item>
            <i-form-item label="实例规格" prop="flavorID">
                <table class="tai-table tai-table-border tai-table-hover">
                    <thead class="tai-table-header">
                        <tr>
                            <th class="tai-table-cell-narrow" />
                            <th class="tai-table-cell-narrow">规格族</th>
                            <th>实例规格</th>
                            <th class="tai-table-cell-narrow">vCPU</th>
                            <th class="tai-table-cell-narrow">内存</th>
                            <th>处理器型号</th>
                            <th>处理器主频</th>
                            <th>内网带宽</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in templateList" :key="item.id">
                            <td class="tai-table-cell-center">
                                <input
                                    :value="item.flavorID"
                                    :checked="item.flavorID === form.flavorID"
                                    v-model.lazy="form.flavorID"
                                    type="radio"
                                    name="flavorID"
                                >
                            </td>
                            <td class="tai-table-cell-center">{{ item.group }}</td>
                            <td>{{ item.flavorName }}</td>
                            <td class="tai-table-cell-center">{{ item.vcpu }}</td>
                            <td class="tai-table-cell-center">{{ item.ram }}</td>
                            <td>{{ item.cputype }}</td>
                            <td class="tai-table-cell-center">{{ item.cpufrquency }}</td>
                            <td class="tai-table-cell-center">{{ item.bandwith }}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="tai-form-item-help-tip">
                    需要其他规格请联系运营人员后台开通
                </p>
            </i-form-item>
            <i-form-item label="购买实例数量" prop="instanceNum">
                <i-input
                    v-model.number="form.instanceNum"
                    placeholder="请输入购买实例数量"
                    class="input-wide"
                    name="instanceNum"
                    type="number"
                >
                    <span slot="append">台</span>
                </i-input>
                <p class="tai-form-item-help-tip">
                    最多可开通10台ECS
                </p>
            </i-form-item>
            <i-form-item label="系统镜像" prop="imageID">
                <i-select
                    v-model="imageSelected"
                    class="input-wide"
                    name="platform"
                    placeholder="请选择操作系统"
                    @on-change="handlePlatformChange"
                >
                    <i-option v-for="(item, key) in imageList" :key="key" :value="key">
                        {{ key }}
                    </i-option>
                </i-select>
                <i-select
                    v-model="form.imageID"
                    :key="imageSelected"
                    :disabled="!imageSelected"
                    class="input-wide"
                    placeholder="请选择版本"
                    name="imageID"
                >
                    <i-option
                        v-for="item in imageList[imageSelected]"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.version }}
                    </i-option>
                </i-select>
            </i-form-item>
            <i-form-item label="系统盘">
                <i-input
                    class="input-wide"
                    type="number"
                    value="20"
                    name="storageNum"
                    required
                    min="20"
                    max="500"
                    disabled
                >
                    <span slot="append">GB</span>
                </i-input>
            </i-form-item>
            <i-form-item label="数据盘" prop="disk">
                <i-input
                    v-model.number="form.disk"
                    class="input-wide"
                    placeholder="请输入数据盘大小"
                    type="number"
                    value="20"
                    name="disk"
                    required
                    min="20"
                    max="500"
                >
                    <span slot="append">GB</span>
                </i-input>
                <p class="tai-form-item-help-tip">
                    高效云盘 容量范围：20—500
                </p>
            </i-form-item>
        </i-card>
        <i-card title="网络" class="card">
            <i-form-item label="共享带宽" prop="isBoundPublic">
                <i-checkbox
                    v-model="form.isBoundPublic"
                    true-value="1"
                    false-value="0"
                >分配公网IP地址</i-checkbox>
                <p class="tai-form-item-help-tip"><span class="text-primary">50Mbps</span>内测期间，TAL为您提供上线为50M的共享公网宽带</p>
            </i-form-item>
        </i-card>
        <i-card title="系统设置" class="card">
            <i-form-item label="登录名">
                <i-input
                    class="input-wide"
                    type="text"
                    name="username"
                    value="root"
                    disabled
                />
            </i-form-item>
            <i-form-item label="登录密码" prop="password">
                <i-input
                    v-model="form.password"
                    class="input-wide"
                    name="password"
                    placeholder="请输入新密码"
                    type="password"
                />
                <p class="tai-form-item-help-tip">8-30个字符，且同时包含三项(大写字母，小写字母，数字或特殊符号)</p>
            </i-form-item>
            <i-form-item label="确认密码" prop="retypePassword">
                <i-input
                    v-model="form.retypePassword"
                    class="input-wide"
                    name="retypePassword"
                    placeholder="请输入确认密码"
                    type="password"
                />
                <p class="tai-form-item-help-tip">请牢记您所设置的密码，如遗忘可登录ECS控制台重置密码</p>
            </i-form-item>
            <i-form-item label="实例名称" prop="name">
                <i-input
                    v-model="form.name"
                    class="input-wide"
                    name="name"
                    type="text"
                />
                <p class="tai-form-item-help-tip">2-128个字符，以大小写字母或中文开头，可包含数字、"."、"_"、或"-"</p>
            </i-form-item>
            <i-form-item label="主机名" prop="mainframe">
                <i-input
                    v-model="form.mainframe"
                    class="input-wide"
                    name="mainframe"
                    placeholder="操作系统内部的计算机名，选填项"
                    type="text"
                />
            </i-form-item>
            <i-form-item label="描述" prop="description">
                <i-input
                    v-model="form.description"
                    :rows="3"
                    :autosize="{minRows: 3, maxRows: 6}"
                    name="description"
                    type="textarea"
                />
                <p class="tai-form-item-help-tip">长度为2-256个字符，不能以http://或https://开头</p>
            </i-form-item>
            <i-form-item class="form-footer">
                <i-button
                    :disabled="status === 'request'"
                    :loading="status === 'request'"
                    html-type="submit"
                    type="primary"
                    class="btn-submit"
                >确认创建</i-button>
                <i-button
                    :disabled="status === 'request'"
                    :loading="status === 'request'"
                    html-type="reset"
                    class="btn-reset"
                    @click="handleReset"
                >取消</i-button>
            </i-form-item>
        </i-card>
    </i-form>
</template>

<script src="./create.js"></script>
<style scoped src="./create.less"></style>

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
                <i-input-number
                    v-model.number="form.instanceNum"
                    :min="1"
                    :max="10"
                    :step="1"
                    placeholder="请输入购买实例数量"
                    class="input-wide"
                    name="instanceNum"
                    type="number"
                />
                台
                <p class="tai-form-item-help-tip">
                    最多可开通10台ECS
                </p>
            </i-form-item>
            <i-form-item label="镜像" prop="imageID">
                <i-radio-group
                    v-model="imageType"
                    type="button"
                    @on-change="handlePlatformChange"
                >
                    <i-radio label="系统镜像" />
                    <i-radio label="自定义镜像" />
                </i-radio-group>
                <br>
                <i-select
                    v-if="imageType === '系统镜像'"
                    v-model="imageSelected"
                    class="input-wide"
                    name="platform"
                    placeholder="请选择操作系统"
                    @on-change="handlePlatformChange"
                >
                    <i-option v-for="(item, key) in systemImageList" :key="key" :value="key">
                        {{ key }}
                    </i-option>
                </i-select>
                <i-select
                    v-if="imageType === '系统镜像'"
                    v-model="form.imageID"
                    :key="imageSelected"
                    :disabled="!imageSelected"
                    class="input-wide"
                    placeholder="请选择版本"
                    name="imageID"
                >
                    <i-option
                        v-for="item in systemImageList[imageSelected]"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.version }}
                    </i-option>
                </i-select>
                <i-select
                    v-if="imageType === '自定义镜像' && customImageList.length > 0"
                    v-model="form.imageID"
                    class="input-wide"
                    placeholder="请选择自定义镜像"
                    name="imageID"
                >
                    <i-option
                        v-for="item in customImageList"
                        :key="item.imageID"
                        :value="item.imageID"
                    >
                        {{ item.imageName }}
                    </i-option>
                </i-select>
                <p v-else-if="imageType === '自定义镜像'">暂无查询结果</p>
            </i-form-item>
            <i-form-item label="系统盘" prop="storageNum">
                <i-input-number
                    v-model.number="form.storageNum"
                    :min="20"
                    :max="500"
                    :step="1"
                    class="input-wide"
                    placeholder="请输入系统盘大小"
                    type="number"
                    name="storageNum"
                    required
                    disabled
                />
                GB
            </i-form-item>
            <i-form-item label="数据盘" prop="disk">
                <i-input-number
                    v-model.number="form.disk"
                    :min="20"
                    :max="2000"
                    :step="1"
                    class="input-wide"
                    placeholder="请输入数据盘大小"
                    type="number"
                    name="disk"
                    required
                />
                GB
                <p class="tai-form-item-help-tip">
                    高效云盘 容量范围：20—2000
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
                <p class="tai-form-item-help-tip">长度为8-32位，大写、小写、数字、特殊字符.!@#￥%^()_+-=占三种</p>
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
                <p class="tai-form-item-help-tip">2-64个字符，以大小写字母或中文开头，可包含数字和"-"</p>
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
                <p class="tai-form-item-help-tip">长度为2-256个字符</p>
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

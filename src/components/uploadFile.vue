<template>
    <div style="padding-bottom: 10px">
        <Input :value="value" disabled>
            <div slot="append">
                <Upload
                        :name="name"
                        :data="{key:name}"
                        :format="format"
                        :max-size="maxSize"
                        :show-upload-list="false"
                        :action="uploadApiUrl"
                        :on-progress="onUploadProgress"
                        :on-success="onUploadSuccess"
                        :on-error="onUploadError"
                        :on-remove="onUploadRemove"
                        :on-preview="onUploadPreview"
                        :on-exceeded-size="onUploadExceededSize"
                        :on-format-error="onUploadFormatError"
                        style="display: inline-block;"
                >
                    <Button icon="md-cloud-upload">选择文件</Button>
                </Upload>
                <Button icon="md-search" @click="view"></Button>
                <Button icon="md-backspace" @click="remove"></Button>
            </div>
        </Input>
    </div>
</template>
<script>
    import {actionUrl} from "../helper";
    import {requestSuccessHandle} from "../plugins/request";

    export default {
        name: "uploadFile",
        data() {
            return {
                uploadApiUrl: actionUrl('/upload'),
            }
        },
        props: {
            value: {
                type: String,
                default: function () {
                    return "";
                }
            },
            name: {
                type: String,
                default: function () {
                    return "file";
                }
            },
            format: {
                type: Array,
                default: function () {
                    return ['jpeg', 'jpg', 'png', 'gif']
                }
            },
            domain: {
                type: String,
                default: function () {
                    return "";
                }
            },
            maxSize: {
                type: Number, // 大小 单位kb
            },
            onSuccess: {
                type: Function,
                default() {
                    return {};
                }
            },
            onError: {
                type: Function,
                default() {
                    return {};
                }
            },
            onRemove: {
                type: Function,
                default() {
                    return {};
                }
            }
        },
        methods: {
            remove() {
                this.$emit('input', "");
                this.$emit('remove')
            },
            view() {
                window.open(this.domain + "" + this.value)
            },
            onUploadProgress() {
            },
            onUploadSuccess(response, file, fileList) {
                requestSuccessHandle(this, response, true, true, () => {
                    this.onSuccess(response.data, file, fileList);
                    this.$emit('input', response.data.url);
                })
            },
            onUploadError(error, file) {
                this.$Notice.error({
                    title: '错误提示',
                    desc: error,
                    duration: 10
                });
                this.onError(error, file)
            },
            onUploadRemove() {
            },
            onUploadPreview() {
            },
            onUploadExceededSize(file) {
                this.onUploadError("文件过大,最大文件大小为:" + this.maxSize + 'kb', file)
            },
            onUploadFormatError(file) {
                this.onUploadError("文件格式错误,允许上传的文件格式为:" + this.format.join(','), file)
            },
        },
    }
</script>
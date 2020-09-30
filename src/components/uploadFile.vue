<template>
    <div style="padding-bottom: 10px">
        <Input :value="value" disabled>
            <div slot="append">
                <Upload
                        :name="name"
                        :data="{dir:dir}"
                        :format="format"
                        :headers="headers"
                        :max-size="maxSize"
                        :show-upload-list="false"
                        :action="url"
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
import { actionUrl, config } from '../helper'
import {requestSuccessHandle} from "../plugins/request";

export default {
    name: "uploadFile",
    data() {
        return {
            full_url:"",
        }
    },
    props: {
        value: {
            type: String,
            default: function () {
                return "";
            }
        },
        action: {
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
        dir: {
            type: String,
            default: function () {
                return "";
            }
        },
        format: {
            type: Array,
            default: function () {
                return ['jpeg', 'jpg', 'png', 'gif']
            }
        },
        maxSize: {
            type: Number, // 大小 单位kb
        },
        viewUrlPrefix: { // 预览url前缀
            type: String,
            default: function () {
                return config('UPLOAD_FILE_VIEW_URL_PREFIX')
            }
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
    computed: {
        url () {
            return actionUrl(this.action)
        },
        headers () {
            let headers = {};
            if (process.env.NODE_ENV === "development"){
                headers["Authorization"] = config('AUTHORIZATION')
            }
            return headers
        }
    },
    methods: {
        remove() {
            this.$emit('input', "");
            this.$emit('remove')
        },
        view() {
            window.open(this.viewUrlPrefix+this.value)
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
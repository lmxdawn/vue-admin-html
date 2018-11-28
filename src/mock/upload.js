/**
 * Created by lk on 18/4/28.
 */

// 获取七牛云
const qiuniuUpToken = {
    data: {
        domain: "https://res.ishiguangji.cn",
        expires_in: 86400,
        up_token:
            "GRUuplbSg1DrFbLlx2__UPc0Qe0oIcIdqVRPgQ6i:nPJdU3WUHFcu5MSc4EOY8RSThGE=:eyJzY29wZSI6InNoaWd1YW5namkiLCJkZWFkbGluZSI6MTU0MzQ2NzcyN30=",
        upload_url: "/admin/file/upload/uploadFile"
    }
};

// 上传文件
const uploadFile = {
    key: "TIMjie_tu_20180516105525-fu_ben_.png"
};

export default {
    qiuniuUpToken,
    uploadFile
};

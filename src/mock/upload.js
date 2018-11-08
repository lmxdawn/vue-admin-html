/**
 * Created by lk on 18/4/28.
 */

// 文件列表
const index = {
    data: {
        total: 3,
        list: [
            {
                path: "/TIMjie_tu_20180516105525.png",
                filename: "TIMjie_tu_20180516105525.png",
                className: "fileicon-small-pic",
                url:
                    "https://www.example.com/uploads/TIMjie_tu_20180516105525.png",
                mtime: 1526663961,
                is_dir: 0,
                fileExt: "png",
                size: 26895
            },
            {
                path: "/TIMjie_tu_20180516105525-fu_ben_.png",
                filename: "TIMjie_tu_20180516105525-fu_ben_.png",
                className: "fileicon-small-pic",
                url:
                    "https://www.example.com/uploads/TIMjie_tu_20180516105525-fu_ben_.png",
                mtime: 1526664941,
                is_dir: 0,
                fileExt: "png",
                size: 26895
            },
            {
                path: "/ssss",
                filename: "ssss",
                className: "dir-small",
                url: "https://www.example.com/uploads/ssss",
                mtime: 1526665804,
                is_dir: 1,
                fileExt: "",
                size: 0
            }
        ]
    }
};

// 上传文件
const up = {
    data: {
        path: "TIMjie_tu_20180516105525-fu_ben_.png",
        filename: "TIMjie_tu_20180516105525-fu_ben_.png",
        className: "fileicon-small-pic",
        url:
            "https://www.example.com/uploads/TIMjie_tu_20180516105525-fu_ben_.png",
        mtime: 1526670285,
        is_dir: 0,
        fileExt: "png",
        size: 26895
    }
};

// 创建文件夹
const newDir = {
    data: {
        path: "/newDir",
        filename: "newDir",
        className: "",
        url: "https://www.example.com/uploads/newDir",
        mtime: 1526670443,
        is_dir: 1,
        fileExt: "",
        size: 0
    }
};

export default {
    index,
    up,
    newDir
};

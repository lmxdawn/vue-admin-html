const index = {
    data: {
        total: 1,
        list: [
            {
                site_id: 1,
                site_name: "测试12222111",
                describe: "支持android和ios",
                ad_ids: [4, 1],
                ads: [
                    {
                        ad_id: 4,
                        title: "fffxxxx",
                        describe: "vvv",
                        status: 0
                    },
                    {
                        ad_id: 1,
                        title: "阿范德萨",
                        describe: "撒地方士大夫",
                        status: 1
                    }
                ]
            },
            {
                site_id: 2,
                site_name: "车是是是",
                describe: "车是是是发发发",
                ad_ids: [1, 2, 4],
                ads: [
                    {
                        ad_id: 1,
                        title: "阿范德萨",
                        describe: "撒地方士大夫",
                        status: 1
                    },
                    {
                        ad_id: 2,
                        title: "ffff",
                        describe: "fff",
                        status: 0
                    },
                    {
                        ad_id: 4,
                        title: "fffxxxx",
                        describe: "vvv",
                        status: 0
                    }
                ]
            }
        ]
    }
};

const adList = {
    data: [
        {
            ad_id: 1,
            title: "阿范德萨",
            describe: "撒地方士大夫",
            status: 1
        },
        {
            ad_id: 6,
            title: "侧嗯嗯得到的",
            describe: "车次多的的",
            status: 1
        },
        {
            ad_id: 7,
            title: "hi额接口数据东方丽景",
            describe: "反倒是打发士大夫撒",
            status: 1
        }
    ]
};

const save = {
    data: {
        site_id: 2
    }
};

const edit = {
    code: 0,
    message: "success"
};

const del = {
    code: 0,
    message: "success"
};

export default {
    index,
    adList,
    save,
    edit,
    del
};

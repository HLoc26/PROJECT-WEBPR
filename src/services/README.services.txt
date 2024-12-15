services are in here


object = {
    cat_id: int,
    cat_name: string,
    sub_cats: []
}

[
    {
        cat_id: 1,
        cat_name: 'Kinh doanh',
        sub_cats: [
            {
                cat_id: 2,
                cat_name: 'Nong san',
                sub_cats: [] // or null
            },
            {
                cat_id: 3,
                cat_name: 'Hai san',
                sub_cats: []
            },
        ]
    },
    {
        cat_id: 4,
        cat_name: 'Kinh te',
        sub_cats: [
            {
                cat_id: 5,
                cat_name: 'Chung khoan',
                sub_cats: [] // or null
            },
        ]
    }
]

// ===============================================

[
    {
        cat_id: 1,
        cat_name: 'Kinh doanh',
        sub_cats: [ object, object ]
    },
    {
        cat_id: 4,
        cat_name: 'Kinh te',
        sub_cats: [ object ]
    }
]
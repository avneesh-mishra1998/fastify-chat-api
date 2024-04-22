const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();



module.exports = {
    get_account_metrics: async (account_id, user_account_id) => {
        let account = await prisma.account.findUnique(
            {
                where: {id: account_id}
            },
            // {
            //     _count: {
            //         select: {
            //             follower: true,
            //             following: true,
            //             posts: true
            //         },
            //     },
            // }
        );
        // account.following_state = (user_account_id !== account.id) ? await is_following(prisma, user_account_id, account.id) : "SELF_PROFILE";
        // account.subscribed_state= (user_account_id !== account.id) ? await is_subscribed(prisma, user_account_id, account.id) : "SELF_PROFILE";
        return account;
    },
}
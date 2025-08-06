export const makeActivityJson = (
    {activity, who = "who", what="what", content="content"} ) => {
    activity = activity || [];
    return [
        `${new Date().toLocaleString()}__${who}__${what}__${content}`,
        ...activity
    ]
};
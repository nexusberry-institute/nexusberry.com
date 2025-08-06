import { 
    QuestionOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignMiddleOutlined,
    VerticalAlignTopOutlined

} from "@ant-design/icons";

export const interestLevels = [
    {
        "level": "Unknown",
        "color": "#CCCCCC", // Light gray
        "icon": <QuestionOutlined />
    },
    {
        "level": "Low",
        "color": "#6EDB8F", // Medium green
        "icon": <VerticalAlignBottomOutlined />
    },
    {
        "level": "Medium",
        "color": "#38B44A", //  (Dark green)
        "icon": <VerticalAlignMiddleOutlined />

    },
    {
        "level": "High",
        "color": "#0E7A0D", //  (Deep green)
        "icon": <VerticalAlignTopOutlined />
    }
]
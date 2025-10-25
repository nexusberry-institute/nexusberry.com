export const leadStages=[
  {
    value: "Raw",
    label: "Raw",
  },
  {
    value: "FormSubmitted",
    label: "FormSubmitted",
  },
  {
    value: "Followup",
    label: "Followup",
  },
  {
    value: "Orientation",
    label: "Orientation",
  },
  {
    value: "Trial",
    label: "Trial",
  },
  {
    value: "Workshop",
    label: "Workshop",
  },
  {
    value: "Admission",
    label: "Admission",
  },
  {
    value: "Waste",
    label: "Waste",
  },
  {
    value: "Lost",
    label: "Lost",
  }
]

export const getStageColor = (stage) => {
    if (stage === "ONE_FOLLOW_UP" || stage === "ONE_FOLLOW_UP_NOT_RESPONDING") {
      return "#0A1DEB";
    } else if (stage === "TWO.1_INTERESTED_LOW") {
      return "#5CED52";
    } else if (stage === "TWO.2_INTERESTED_MEDIUM") {
      return "0dd958";
    } else if (stage === "TWO.3_INTERESTED_HIGH") {
      return " green";
    } else if (stage === "THREE_ATTENDED_DEMO") {
      return "yellow";
    } else if (stage === "FOUR_CONFIRMED_PAYING") {
      return "#FA7100";
    } else if (stage === "FIVE_ADMITTED") {
      return "#95451E";
    } else if (stage === "NO_FOLLOWUP_REFUSED") {
      return "red";
    } else if (stage === "NO_FOLLOWUP_WASTE") {
      return "red";
    }
  };
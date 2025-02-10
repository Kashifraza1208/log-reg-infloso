import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

export const getStatusName = (val: string) => {
  switch (val) {
    case "under_discuss":
      return "Under Discussion";
    case "maintenance":
      return "Maintenance";
    case "in_development":
      return "In-Development";
    case "completed":
      return "Completed";
    case "suspended":
      return "Suspended";
    default:
      return "Under Discussion";
  }
};

export const ProjectStatus = [
  {
    value: "under_discuss",
    label: "Under Discussion",
  },
  {
    value: "in_development",
    label: "In-Development",
  },
  {
    value: "maintenance",
    label: "Maintenance",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "suspended",
    label: "Suspended",
  },
];

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    color: "white",
    boxShadow: theme.shadows[1],
    fontSize: 18,
  },
}));



const StatCard = ({
  icon,
  count,
  label,
  subtext,
  subtextColorClass = 'text-muted', // text-success, text-danger, text-muted, link-blue-new
  iconBgColorClass = 'color-blue-bg', // color-blue-bg, color-green-bg, color-orange-bg, color-purple-bg, color-red-bg
  onClick
}) => {
  return (
    <div className="stat-card-new" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div className={`stat-icon-wrapper ${iconBgColorClass}`}>
        <span className={`glyphicon ${icon}`}></span>
      </div>
      <div className="stat-meta">
        <span className="stat-number-new">{count}</span>
        <span className="stat-label-new">{label}</span>
        {subtext && (
          <span className={`stat-subtext-new ${subtextColorClass}`}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
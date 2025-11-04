import React from 'react';
import clsx from 'clsx';

const StatusBadge = ({ 
  status, 
  type = 'member', 
  size = 'default',
  variant = 'light',
  showDot = false,
  className = '' 
}) => {
  const getStatusConfig = (status, type, variant) => {
    const statusMappings = {
      member: {
        active: {
          label: 'Active',
          colors: {
            light: 'bg-status-success-light text-status-success-dark border-status-success/30',
            solid: 'bg-member-active text-white border-member-active',
            outline: 'bg-transparent text-member-active border-member-active'
          }
        },
        pending: {
          label: 'Pending',
          colors: {
            light: 'bg-status-warning-light text-status-warning-dark border-status-warning/30',
            solid: 'bg-member-pending text-black border-member-pending',
            outline: 'bg-transparent text-member-pending border-member-pending'
          }
        },
        inactive: {
          label: 'Inactive',
          colors: {
            light: 'bg-status-pending-light text-status-pending-dark border-status-pending/30',
            solid: 'bg-member-inactive text-white border-member-inactive',
            outline: 'bg-transparent text-member-inactive border-member-inactive'
          }
        },
        suspended: {
          label: 'Suspended',
          colors: {
            light: 'bg-status-error-light text-status-error-dark border-status-error/30',
            solid: 'bg-member-suspended text-white border-member-suspended',
            outline: 'bg-transparent text-member-suspended border-member-suspended'
          }
        },
        new_member: {
          label: 'New Member',
          colors: {
            light: 'bg-status-info-light text-status-info-dark border-status-info/30',
            solid: 'bg-status-info text-white border-status-info',
            outline: 'bg-transparent text-status-info border-status-info'
          }
        }
      },
      priority: {
        high: {
          label: 'High Priority',
          colors: {
            light: 'bg-status-error-light text-status-error-dark border-status-error/30',
            solid: 'bg-priority-high text-white border-priority-high',
            outline: 'bg-transparent text-priority-high border-priority-high'
          }
        },
        medium: {
          label: 'Medium Priority',
          colors: {
            light: 'bg-status-warning-light text-status-warning-dark border-status-warning/30',
            solid: 'bg-priority-medium text-black border-priority-medium',
            outline: 'bg-transparent text-priority-medium border-priority-medium'
          }
        },
        low: {
          label: 'Low Priority',
          colors: {
            light: 'bg-status-success-light text-status-success-dark border-status-success/30',
            solid: 'bg-priority-low text-white border-priority-low',
            outline: 'bg-transparent text-priority-low border-priority-low'
          }
        },
        none: {
          label: 'No Priority',
          colors: {
            light: 'bg-gray-100 text-gray-700 border-gray-300',
            solid: 'bg-priority-none text-white border-priority-none',
            outline: 'bg-transparent text-priority-none border-priority-none'
          }
        }
      },
      status: {
        success: {
          label: 'Success',
          colors: {
            light: 'bg-status-success-light text-status-success-dark border-status-success/30',
            solid: 'bg-status-success text-white border-status-success',
            outline: 'bg-transparent text-status-success border-status-success'
          }
        },
        warning: {
          label: 'Warning',
          colors: {
            light: 'bg-status-warning-light text-status-warning-dark border-status-warning/30',
            solid: 'bg-status-warning text-black border-status-warning',
            outline: 'bg-transparent text-status-warning border-status-warning'
          }
        },
        error: {
          label: 'Error',
          colors: {
            light: 'bg-status-error-light text-status-error-dark border-status-error/30',
            solid: 'bg-status-error text-white border-status-error',
            outline: 'bg-transparent text-status-error border-status-error'
          }
        },
        info: {
          label: 'Info',
          colors: {
            light: 'bg-status-info-light text-status-info-dark border-status-info/30',
            solid: 'bg-status-info text-white border-status-info',
            outline: 'bg-transparent text-status-info border-status-info'
          }
        }
      }
    };

    const statusConfig = statusMappings[type]?.[status];
    if (statusConfig) {
      return {
        label: statusConfig.label,
        className: statusConfig.colors[variant]
      };
    }

    // Fallback for unknown status
    return {
      label: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
      className: 'bg-gray-100 text-gray-700 border-gray-300'
    };
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'px-2 py-0.5 text-xs';
      case 'large':
        return 'px-4 py-1.5 text-sm';
      default:
        return 'px-2.5 py-0.5 text-xs';
    }
  };

  const getDotColor = (status, type) => {
    const dotMappings = {
      member: {
        active: 'bg-member-active',
        pending: 'bg-member-pending',
        inactive: 'bg-member-inactive',
        suspended: 'bg-member-suspended',
        new_member: 'bg-status-info'
      },
      priority: {
        high: 'bg-priority-high',
        medium: 'bg-priority-medium',
        low: 'bg-priority-low',
        none: 'bg-priority-none'
      },
      status: {
        success: 'bg-status-success',
        warning: 'bg-status-warning',
        error: 'bg-status-error',
        info: 'bg-status-info'
      }
    };

    return dotMappings[type]?.[status] || 'bg-gray-500';
  };

  const config = getStatusConfig(status, type, variant);
  const sizeClasses = getSizeClasses(size);

  if (showDot) {
    const dotColor = getDotColor(status, type);
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <div className={clsx('w-2 h-2 rounded-full', dotColor)}></div>
        <span className="text-sm text-gray-700">{config.label}</span>
      </div>
    );
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium border',
        config.className,
        sizeClasses,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
# BGP Members Management - Color System Documentation

## Overview
This document outlines the comprehensive color coding system used throughout the BGP Members Management application. The system provides consistent visual feedback and improves user experience through meaningful color associations.

## Color Palette

### Brand Colors
- **BGP Dark**: `#212121` - Primary dark color for headers and text
- **BGP Darker**: `#1a1a1a` - Deeper dark for contrast areas  
- **BGP Gold**: `#9c8040` - Primary brand accent color
- **BGP Teal**: `#009688` - Secondary accent color
- **BGP Gray Light**: `#f5f5f5` - Light background color

### Status Color System

#### Success (Green)
- **Primary**: `#10B981`
- **Light**: `#D1FAE5` (backgrounds)
- **Dark**: `#047857` (text on light backgrounds)
- **Usage**: Active members, successful operations, positive states

#### Warning (Amber)
- **Primary**: `#F59E0B`
- **Light**: `#FEF3C7` (backgrounds)
- **Dark**: `#D97706` (text on light backgrounds)
- **Usage**: Pending members, caution states, awaiting action

#### Error (Red)  
- **Primary**: `#EF4444`
- **Light**: `#FEE2E2` (backgrounds)
- **Dark**: `#DC2626` (text on light backgrounds)
- **Usage**: Suspended members, errors, critical states

#### Info (Blue)
- **Primary**: `#3B82F6`
- **Light**: `#DBEAFE` (backgrounds)  
- **Dark**: `#1D4ED8` (text on light backgrounds)
- **Usage**: New members, informational states, general info

#### Pending (Gray)
- **Primary**: `#6B7280`
- **Light**: `#F3F4F6` (backgrounds)
- **Dark**: `#374151` (text on light backgrounds)
- **Usage**: Inactive members, neutral states, disabled elements

## Member Status Colors

### Member States
- **Active**: Green (`#10B981`) - Fully active church members
- **Pending**: Amber (`#F59E0B`) - Awaiting approval or completion
- **Inactive**: Gray (`#6B7280`) - Not currently active
- **Suspended**: Red (`#EF4444`) - Temporarily suspended
- **New Member**: Blue (`#3B82F6`) - Recently joined, needs processing

### Visual Representation Examples
```jsx
<StatusBadge status="active" type="member" variant="light" />
<StatusBadge status="pending" type="member" variant="solid" />
<StatusBadge status="inactive" type="member" showDot={true} />
```

## Priority Colors

### Priority Levels
- **High**: Red (`#DC2626`) - Urgent attention required
- **Medium**: Amber (`#F59E0B`) - Moderate attention needed
- **Low**: Green (`#10B981`) - Low priority, handle when convenient
- **None**: Gray (`#9CA3AF`) - No specific priority assigned

## Component Usage

### StatusBadge Component
The main component for displaying color-coded status information.

**Props:**
- `status` - The status value (required)
- `type` - Type of status: 'member', 'priority', 'status' (default: 'member')
- `variant` - Display style: 'light', 'solid', 'outline' (default: 'light')
- `size` - Size: 'small', 'default', 'large' (default: 'default')
- `showDot` - Show as colored dot with text (default: false)
- `className` - Additional CSS classes

**Examples:**
```jsx
// Member status with light background
<StatusBadge status="active" type="member" variant="light" />

// Priority with solid background
<StatusBadge status="high" type="priority" variant="solid" />

// Status as dot indicator
<StatusBadge status="success" type="status" showDot={true} />

// Custom styling
<StatusBadge 
  status="pending" 
  type="member" 
  variant="outline"
  size="large"
  className="mb-2"
/>
```

## Accessibility Considerations

### Color Contrast
All color combinations meet WCAG 2.1 AA standards:
- Light backgrounds use dark text colors for proper contrast
- Solid backgrounds use white or black text as appropriate
- Outline variants use border colors that meet contrast requirements

### Color Blindness Support
- Status information is also conveyed through text labels
- Consistent positioning and shapes provide additional context
- Dot indicators can be used alongside color for extra clarity

## Implementation Guidelines

### Consistent Usage
- Use the same color for the same meaning throughout the application
- Don't use status colors for decorative purposes
- Maintain color hierarchy (red for urgent, amber for caution, etc.)

### Best Practices
1. Always include text labels with colored elements
2. Use light variants for table cells and card backgrounds
3. Use solid variants for prominent status displays
4. Use outline variants for secondary information
5. Use dots for compact status indicators

### Do's and Don'ts

#### Do:
- Use green for positive states (active, success)
- Use red for negative states (error, suspended)
- Use amber for pending/warning states
- Combine colors with descriptive text
- Test color combinations for accessibility

#### Don't:
- Mix color meanings (don't use red for success)
- Rely solely on color to convey information
- Use brand colors for status information
- Override status colors without good reason
- Forget to test with screen readers

## Tailwind CSS Classes

### Custom Color Classes Available
```css
/* Member status colors */
bg-member-active, text-member-active, border-member-active
bg-member-pending, text-member-pending, border-member-pending
bg-member-inactive, text-member-inactive, border-member-inactive
bg-member-suspended, text-member-suspended, border-member-suspended

/* Status system colors */
bg-status-success, bg-status-success-light, bg-status-success-dark
bg-status-warning, bg-status-warning-light, bg-status-warning-dark
bg-status-error, bg-status-error-light, bg-status-error-dark
bg-status-info, bg-status-info-light, bg-status-info-dark
bg-status-pending, bg-status-pending-light, bg-status-pending-dark

/* Priority colors */
bg-priority-high, text-priority-high, border-priority-high
bg-priority-medium, text-priority-medium, border-priority-medium
bg-priority-low, text-priority-low, border-priority-low
bg-priority-none, text-priority-none, border-priority-none
```

## Future Considerations

### Planned Additions
- Dark mode color variants
- Additional status types as needed
- Animation states for color transitions
- High contrast mode support

### Maintenance
- Review color choices quarterly for effectiveness
- Update documentation when adding new status types
- Test new colors against accessibility standards
- Gather user feedback on color clarity and meaning

---

## Quick Reference

**Member Statuses**: Active (Green), Pending (Amber), Inactive (Gray), Suspended (Red), New Member (Blue)

**Priorities**: High (Red), Medium (Amber), Low (Green), None (Gray)

**Variants**: Light (subtle backgrounds), Solid (prominent displays), Outline (borders only)

**Usage**: `<StatusBadge status="active" type="member" variant="light" />`
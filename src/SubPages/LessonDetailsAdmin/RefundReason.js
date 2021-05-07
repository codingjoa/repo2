import React from 'react';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

export default ({ refundReason }) => (
  <>
    <Icon
      color={refundReason ? 'secondary' : 'disabled'}
    >
      {refundReason ? (
        <Tooltip
          TransitionComponent={Zoom}
          title={`"${refundReason}" 사유로 환불`}
        >
          <MonetizationOnIcon />
        </Tooltip>
      ) : (
        <MonetizationOnIcon />
      )}
    </Icon>
  </>
)

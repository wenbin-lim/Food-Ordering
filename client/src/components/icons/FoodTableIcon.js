import React from 'react';
import PropTypes from 'prop-types';

// Misc
import { v4 as uuid } from 'uuid';

const FoodTableIcon = ({
  width = 24,
  height = 24,
  active = false,
  showAlert = false,
}) => {
  const maskId = uuid();

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill={active ? 'var(--secondary)' : 'currentColor'}
      className='icon food-table-icon'
    >
      {showAlert && (
        <defs>
          <mask id={maskId}>
            <rect width='100%' height='100%' fill='white' />
            <circle cx='20' cy='4' r='6' fill='black' />
          </mask>
        </defs>
      )}

      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2.00812 1.37538C2.20323 1.21929 2.54697 1 3 1C3.45303 1 3.79677 1.21929 3.99188 1.37538C4.2009 1.54259 4.36807 1.74076 4.4875 1.9C4.61127 2.06503 4.71061 2.22463 4.77784 2.33988C4.81206 2.39855 4.83945 2.44828 4.85902 2.48481C4.86883 2.50313 4.87676 2.51828 4.88269 2.52975L4.89008 2.54418L4.89264 2.54923L4.89363 2.5512L4.89425 2.55243C4.89434 2.55261 4.89443 2.55279 4 3L4.89425 2.55243L4.97103 2.70599L5.88283 10H7.00007L7.00008 7.74994C7.0001 7.3205 7.223 7.01546 7.40763 6.84315C7.58517 6.67744 7.78847 6.57192 7.94993 6.50273C8.27828 6.36201 8.6832 6.26819 9.0857 6.2011C9.90912 6.06387 10.9685 6 12.0001 6C13.0317 6 14.0911 6.06387 14.9145 6.20111C15.317 6.26819 15.7219 6.36201 16.0503 6.50273C16.2117 6.57193 16.415 6.67745 16.5926 6.84316C16.7772 7.01549 17.0001 7.32054 17.0001 7.75V10H18.1173L19.029 2.706L19.1056 2.55279L20.0001 3C19.1056 2.55279 19.1055 2.55297 19.1056 2.55279L19.1064 2.5512L19.1074 2.54923L19.11 2.54418L19.1174 2.52975C19.1233 2.51828 19.1312 2.50313 19.141 2.48481C19.1606 2.44828 19.188 2.39855 19.2222 2.33988C19.2894 2.22463 19.3888 2.06503 19.5126 1.9C19.632 1.74076 19.7992 1.54259 20.0082 1.37538C20.2033 1.21929 20.547 1 21.0001 1C21.4531 1 21.7968 1.21929 21.9919 1.37538C22.201 1.54259 22.3681 1.74076 22.4876 1.9C22.6113 2.06503 22.7107 2.22463 22.7779 2.33988C22.8121 2.39855 22.8395 2.44828 22.8591 2.48481C22.8689 2.50313 22.8768 2.51828 22.8827 2.52975L22.8901 2.54418L22.8927 2.54923L22.8937 2.5512L22.8943 2.55243C22.8944 2.55261 22.8945 2.55279 22.0001 3L22.8943 2.55243L23.0001 2.76393V21H22.0001C23.0001 21 23.0001 20.9997 23.0001 21V21.001L23.0001 21.0022L23 21.0047L23 21.0109L22.9998 21.0279C22.9996 21.0372 22.9994 21.0484 22.999 21.0613C22.9988 21.0668 22.9987 21.0726 22.9984 21.0787C22.997 21.1193 22.9942 21.1744 22.9888 21.2393C22.9783 21.3647 22.9565 21.5473 22.9077 21.7425C22.8624 21.9236 22.7748 22.1962 22.5891 22.4438C22.3823 22.7195 22.0179 23 21.5001 23C21.0988 23 20.7491 22.8209 20.5586 22.712C20.3312 22.5821 20.114 22.4218 19.9379 22.2809C19.7578 22.1368 19.5987 21.9952 19.4858 21.8911C19.4289 21.8385 19.3824 21.7942 19.3494 21.7624L19.3102 21.7242L19.2987 21.7128L19.2951 21.7092L19.2938 21.708C19.2937 21.7079 19.2929 21.7071 20.0001 21L19.2929 21.7071L19.0572 21.4714L18.1328 15H17.0001V21.75C17.0001 22.3023 16.5524 22.75 16.0001 22.75C15.4478 22.75 15.0001 22.3023 15.0001 21.75V15.2022C14.6288 15.5299 14.215 15.8595 13.7919 16.1267C13.3051 16.4342 12.6672 16.75 12.0001 16.75C11.3329 16.75 10.6951 16.4342 10.2083 16.1267C9.78513 15.8595 9.37132 15.5299 9.00008 15.2022V21.75C9.00008 22.3023 8.55236 22.75 8.00008 22.75C7.44779 22.75 7.00008 22.3023 7.00008 21.75V15H5.8673L4.94281 21.4714L4.70711 21.7071L4 21C4.70711 21.7071 4.7072 21.707 4.70711 21.7071L4.70498 21.7092L4.70138 21.7128L4.68989 21.7242L4.65065 21.7624C4.61767 21.7942 4.57119 21.8385 4.51422 21.8911C4.40134 21.9952 4.24227 22.1368 4.0622 22.2809C3.88603 22.4218 3.6688 22.5821 3.44145 22.712C3.25092 22.8209 2.90126 23 2.5 23C1.98214 23 1.61774 22.7195 1.41094 22.4438C1.22525 22.1962 1.13763 21.9236 1.09236 21.7425C1.04356 21.5473 1.02172 21.3647 1.01127 21.2393C1.00586 21.1744 1.00307 21.1193 1.00161 21.0787C1.00088 21.0582 1.00048 21.0411 1.00026 21.0279L1.00005 21.0109L1.00001 21.0047L1 21.0022L1 21.001C1 21.0008 1 21 2 21H1V2.76393L1.10557 2.55279L2 3C1.10557 2.55279 1.10548 2.55297 1.10557 2.55279L1.10637 2.5512L1.10736 2.54923L1.10992 2.54418L1.11731 2.52975C1.12324 2.51828 1.13117 2.50313 1.14098 2.48481C1.16055 2.44828 1.18794 2.39855 1.22216 2.33988C1.28939 2.22463 1.38873 2.06503 1.5125 1.9C1.63193 1.74076 1.7991 1.54259 2.00812 1.37538ZM2.89298 3.45009C2.89295 3.45016 2.89334 3.44938 2.89416 3.44779L2.89298 3.45009ZM3.03176 3.31631C3.02178 3.29969 3.01117 3.28237 3 3.26459V20.5627C3.02064 20.5448 3.04062 20.5272 3.05983 20.5101L4.1327 13H7.00008L7.00007 12H4.11728L3.03176 3.31631ZM9.00007 12.3759C9.04494 12.4262 9.09556 12.4822 9.15129 12.543C9.3968 12.8109 9.73606 13.1646 10.1159 13.5152C10.4998 13.8696 10.9028 14.1999 11.2763 14.4358C11.6801 14.6908 11.9172 14.75 12.0001 14.75C12.0829 14.75 12.3201 14.6908 12.7239 14.4358C13.0974 14.1999 13.5004 13.8696 13.8843 13.5152C14.2641 13.1646 14.6034 12.8109 14.8489 12.543C14.9046 12.4822 14.9552 12.4262 15.0001 12.3759V8.25824C14.8901 8.23058 14.7526 8.20171 14.5857 8.17389C13.9091 8.06113 12.9685 8 12.0001 8C11.0317 8 10.0911 8.06113 9.4145 8.17389C9.24756 8.20172 9.11003 8.23058 9.00008 8.25825L9.00007 12.3759ZM17.0001 13H19.8673L20.9402 20.5101C20.9594 20.5272 20.9794 20.5448 21.0001 20.5627L21.0001 3.2646C20.9889 3.28237 20.9783 3.29969 20.9683 3.31631L19.8828 12H17.0001V13Z'
        mask={showAlert ? `url(#${maskId})` : null}
      />

      {showAlert && <circle cx='20' cy='4' r='4' fill='var(--error)' />}
    </svg>
  );
};

FoodTableIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  active: PropTypes.bool,
  showAlert: PropTypes.bool,
};

export default FoodTableIcon;
const MAPInfo = {
    width: 16,
    height: 11,
    middleHeight: 0,
    middleStartHeight: 0,
    middleEndHeight: 0,
    bottomStartHeight: 0,
    bottomEndHeight: 0,
    victimRectStart: 0,
    victimRectEnd: 0,
    playerRectStart: 0,
    playerRectEnd: 0,
};
MAPInfo.middleHeight = Math.ceil(MAPInfo.height / 2);

MAPInfo.middleStartHeight = MAPInfo.width * (MAPInfo.middleHeight - 1) - 1;
MAPInfo.middleEndHeight = MAPInfo.width * MAPInfo.middleHeight;

MAPInfo.bottomStartHeight = MAPInfo.width * (MAPInfo.height - 1) - 1;
MAPInfo.bottomEndHeight = MAPInfo.width * MAPInfo.height;

MAPInfo.playerRectStart = MAPInfo.middleEndHeight;
MAPInfo.playerRectEnd = MAPInfo.bottomStartHeight;

MAPInfo.victimRectStart = MAPInfo.width;
MAPInfo.victimRectEnd = MAPInfo.middleStartHeight;
export const MAP = {
    ...MAPInfo,
};
export default { MAP };

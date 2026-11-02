const CFG = {
  api: '__rabbit', title: '수주대토', titleSize: 100, sub: '守株待兎 · 그루터기 지키며 토끼 기다리기', unit: '일', tapLabel: '하루 더 기다리기',
  icon: ['clock'],
  colors: { bg: '#1b1a12', band: '#13120c', accent: '#e8a33a', dim: '#a8a08a', cream: '#f2e6cf', leaf: '#7fb069', panel: '#27261b', line: '#3a3a28', faint: '#8a8470', gold: '#f3c34f', red: '#e5484d', ink: '#1b1512', btnShade: '#8d5a22' },
  stat: () => `같이 기다리는 사람 ${fmt(window.__rabbit.D().mk)} · 대신 기다리기 ${window.__rabbit.D().au}번/초`,
  tap: J => J.waitTap(),
  endCard: [['그루터기를 지키지 말고,', 600, 76, 'cream'], ['밭을 갈자.', 710, 130, 'accent'], ['남의 토끼만 보다 끝나는 게임', 940, 50, 'cream'], ['지금 수주대토 하러 가기', 1080, 60, 'leaf'], ['baramutzero-netizen.github.io/stumprabbit', 1180, 38, 'cream', 'Galmuri11']],
  async play(h) {
    // hook: frame one, a golden rabbit is already running at the stump — and it's not yours
    enterT = -1e9; h.J.wait(3, true);
    rabbits.length = 0; taker.t0 -= 1500;   // skip straight to the stranger lifting the golden rabbit
    jackShow = { t0: performance.now(), s: JACK[0], amt: '…나도 여기서 기다려 보기로 했다' };
    h.cap('남이 토끼 주워 가는 걸 봤다', '나도 기다리면 오겠지?', true);
    await h.tapFor(2600, 4);
    h.cap('하루, 또 하루', '토끼는 코앞에서 돌아선다');
    { const tp = h.tapFor(1800, 5); await h.buyAll(0, 60); await tp; }
    h.cap('옆 사람이 1등 됐대', '나도 복권방 앞에서 기다린다');
    h.buy('v1'); { const tp = h.tapFor(2400, 5); await h.buyAll(1, 10); await tp; }
    h.cap('"코인으로 100억" 뉴스', '나도 가즈아');
    await h.venue(2, 10, 0); await h.tapFor(1100, 5);
    h.cap('김 대리는 주식으로 집을,', '남의 영상은 하룻밤에 100만');
    await h.venue(3, 10, 0); await h.tapFor(800, 5); await h.venue(4, 10, 0); await h.tapFor(800, 5);
    h.cap('옆 팀은 투자를,', '옆 동네는 재개발을');
    await h.venue(5, 10, 0); await h.tapFor(800, 5); await h.venue(6, 10, 0); await h.tapFor(800, 5);
    h.cap('남의 AI 앱은 1위,', '나는 거울 앞에서 운을 기다린다');
    await h.venue(7, 10, 0); await h.tapFor(800, 5); await h.venue(8, 10, 0); await h.tapFor(900, 5);
    h.cap('내게 온 토끼 0마리', '');
    window.__endK = 0.45; h.buy('end');
    await h.sleep(1600); h.cap('', '');
  },
};

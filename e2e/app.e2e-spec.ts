import { BaseballGmPage } from './app.po';

describe('baseball-gm App', () => {
  let page: BaseballGmPage;

  beforeEach(() => {
    page = new BaseballGmPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

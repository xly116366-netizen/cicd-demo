const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

test('页面标题正确', async ({ page }) => {
  await expect(page).toHaveTitle('我的任务清单');
});

test('可以添加新任务', async ({ page }) => {
  await page.fill('#task-input', '买牛奶');
  await page.click('#add-btn');
  await expect(page.locator('#task-list li')).toHaveCount(1);
  await expect(page.locator('#task-list li span')).toHaveText('买牛奶');
});

test('回车键可以提交任务', async ({ page }) => {
  await page.fill('#task-input', '写周报');
  await page.keyboard.press('Enter');
  await expect(page.locator('#task-list li')).toHaveCount(1);
});

test('空内容不能添加任务', async ({ page }) => {
  await page.click('#add-btn');
  await expect(page.locator('#task-list li')).toHaveCount(0);
});

test('可以标记任务为完成', async ({ page }) => {
  await page.fill('#task-input', '健身');
  await page.keyboard.press('Enter');
  await page.locator('#task-list li input[type="checkbox"]').click();
  await expect(page.locator('#task-list li.done')).toHaveCount(1);
});

test('计数器显示正确数量', async ({ page }) => {
  await page.fill('#task-input', '任务A');
  await page.keyboard.press('Enter');
  await page.fill('#task-input', '任务B');
  await page.keyboard.press('Enter');
  await page.locator('#task-list li').first().locator('input[type="checkbox"]').click();
  await expect(page.locator('#count')).toHaveText('共 2 个任务，已完成 1 个');
});

test('可以删除任务', async ({ page }) => {
  await page.fill('#task-input', '临时任务');
  await page.keyboard.press('Enter');
  await page.locator('.delete-btn').click();
  await expect(page.locator('#task-list li')).toHaveCount(0);
});

test('可以添加多个任务', async ({ page }) => {
  for (const task of ['任务1', '任务2', '任务3']) {
    await page.fill('#task-input', task);
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('#task-list li')).toHaveCount(3);
});

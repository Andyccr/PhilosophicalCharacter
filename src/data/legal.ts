import type { Locale, Localized } from '@/types/model';

export interface LegalPage {
  slug: 'privacy' | 'terms' | 'disclaimer' | 'contact';
  title: Localized;
  description: Localized;
  sections: Array<{ heading: Localized; body: Localized }>;
}

export const legalPages: LegalPage[] = [
  {
    slug: 'privacy',
    title: { en: 'Privacy', zh: '隐私' },
    description: {
      en: 'What NOEMA stores, what stays on your device, and what this static release does not collect.',
      zh: 'NOEMA 存储什么，什么留在你的设备上，以及这个静态版本不收集什么。',
    },
    sections: [
      {
        heading: { en: 'No account', zh: '没有账户' },
        body: {
          en: 'The questionnaire does not ask for your name, email, or any other identity. You can finish it without telling the site who you are.',
          zh: '问卷不询问你的姓名、邮箱或任何其他身份。你可以在不告诉本站你是谁的情况下完成它。',
        },
      },
      {
        heading: { en: 'What stays on the device', zh: '什么留在设备上' },
        body: {
          en: 'Answers are stored in localStorage under the key noema.assessment.v1. A completed PayPal return is stored under noema.access.v1, and it records the transaction id PayPal sent back, not a card number. The theme choice is stored under noema.theme. The language choice is stored under noema.locale. This release does not set cookies.',
          zh: '回答保存在 localStorage 的 noema.assessment.v1 键下。PayPal 的一次已完成返回保存在 noema.access.v1 键下，其中记录的是 PayPal 送回的交易号，不是卡号。主题选择保存在 noema.theme 键下。语言选择保存在 noema.locale 键下。这个版本不设置 cookie。',
        },
      },
      {
        heading: { en: 'What a share link contains', zh: '分享链接包含什么' },
        body: {
          en: 'A score link is created only when you copy or share it. It carries the six directional indices and a disagreement flag for each axis. It does not carry the option you chose on each question. The results page is marked so that it should not be indexed. Do not put that link in a public place if the indices themselves feel private.',
          zh: '分数链接只在你复制或分享时被创建。它携带六个方向指数，以及每一轴的一个分歧标志。它不携带你在每一题上选择的选项。结果页被标记为不应被索引。如果这些指数本身让你觉得私密，就不要把链接放在公开的地方。',
        },
      },
      {
        heading: { en: 'Deleting data', zh: '删除数据' },
        body: {
          en: 'The results page has a control that removes the questionnaire key from this browser. You can also clear site data in the browser itself. Deleting the key does not affect a score link you already sent to someone else.',
          zh: '结果页有一个控件，可以从这个浏览器中移除问卷的键。你也可以在浏览器中清除站点数据。删除这个键，并不影响你已经发给别人的分数链接。',
        },
      },
      {
        heading: { en: 'Hosting and payment', zh: '托管与支付' },
        body: {
          en: 'The production site is a Cloudflare Worker serving static assets. The host may keep ordinary connection logs under its own policy. When a Cloudflare Web Analytics token is set as a Workers Builds build variable, those pages include Cloudflare’s cookieless JavaScript beacon, which measures visits and performance. It does not set cookies and is not an advertising tracker. If the token is unset, or the site is built outside Workers Builds (including GitHub Pages), no analytics script is added. Payment is handled on PayPal’s own page. This site does not receive card numbers. When PayPal returns the browser with a completed transaction id, that id is stored locally so the profile can open on this device. This page is not a claim of full GDPR compliance.',
          zh: '生产站点是一个提供静态资源的 Cloudflare Worker。托管方可能按其自身政策保留普通的连接日志。当 Workers Builds 的构建变量里设置了 Cloudflare Web Analytics 令牌时，这些页面会加入 Cloudflare 的无 cookie JavaScript 信标，用来衡量访问与性能。它不设置 cookie，也不是广告追踪。如果令牌未设置，或站点是在 Workers Builds 之外构建的（包括 GitHub Pages），则不会加入分析脚本。付款在 PayPal 自己的页面上处理。本站不接收卡号。当 PayPal 把浏览器送回并附上已完成的交易号时，这个交易号会保存在本地，以便在这台设备上打开剖面。本页并不是对完整 GDPR 合规的宣称。',
        },
      },
    ],
  },
  {
    slug: 'terms',
    title: { en: 'Terms of use', zh: '使用条款' },
    description: {
      en: 'Plain-language terms for an exploratory questionnaire. Not a jurisdiction-specific legal instrument.',
      zh: '一份探索性问卷的白话条款。不是针对特定法域的法律文书。',
    },
    sections: [
      {
        heading: { en: 'What you are using', zh: '你在使用什么' },
        body: {
          en: 'NOEMA is an editorial questionnaire about philosophical questions. It is not medical, psychological, educational, or legal advice, and it is not a basis for hiring, admission, clinical care, or any other decision about a person.',
          zh: 'NOEMA 是一份关于哲学问题的编辑性问卷。它不是医疗、心理、教育或法律建议，也不是雇用、录取、临床照护或任何其他关于一个人的决定的依据。',
        },
      },
      {
        heading: { en: 'Your sharing', zh: '你的分享' },
        body: {
          en: 'If you copy a score link or download your answers, you are responsible for where that material goes. The site cannot pull back a link you have already sent.',
          zh: '如果你复制一条分数链接或下载你的回答，你对那些材料去了哪里负责。本站无法收回一条你已经发出的链接。',
        },
      },
      {
        heading: { en: 'Payment', zh: '付款' },
        body: {
          en: 'The questionnaire can be completed without paying. The profile on this device opens after PayPal marks the payment completed and returns the browser with a transaction id. The listed price is EUR 4.99; the PayPal page shows the amount charged. Clicking the PayPal button is not a purchase. This static site does not receive a signed confirmation from PayPal’s servers, so the return must be the one PayPal itself sends. Clearing this browser’s site data removes the unlock on this device.',
          zh: '问卷可以在不付款的情况下做完。这台设备上的剖面，要在 PayPal 把付款标为完成、并把浏览器连同交易号送回之后才会打开。标价是 4.99 欧元；PayPal 页面显示实际收取的金额。点击 PayPal 按钮本身不是购买。这个静态网站不会收到 PayPal 服务器的签名确认，因此返回必须是 PayPal 自己送回的那一次。清除这个浏览器的站点数据，会去掉这台设备上的解锁。',
        },
      },
      {
        heading: { en: 'A limit on what this page is', zh: '本页本身的限度' },
        body: {
          en: 'These terms are written in plain language for a static project. They are not a substitute for counsel, and they should be reviewed before any public commercial launch.',
          zh: '这些条款是为一个静态项目用白话写成的。它们不能代替律师意见，并且在任何公开的商业发布之前应当被审查。',
        },
      },
    ],
  },
  {
    slug: 'disclaimer',
    title: { en: 'Disclaimer', zh: '声明' },
    description: {
      en: 'NOEMA does not diagnose personality, mental health, intelligence, or character.',
      zh: 'NOEMA 不诊断人格、心理健康、智力或品格。',
    },
    sections: [
      {
        heading: { en: 'An exploratory questionnaire', zh: '一份探索性问卷' },
        body: {
          en: 'The result is a structured reading of answers to philosophical questions. It is not a scientifically validated psychometric instrument. It has no norms, no percentiles, and no confidence percentage. Ambiguous axes are labeled as mixed, provisional, or withheld.',
          zh: '结果是对哲学问题之回答的一种有结构的阅读。它不是经过科学验证的心理测量工具。它没有常模，没有百分位，也没有置信百分比。含糊的轴会被标为混合、暂定，或被保留不给。',
        },
      },
      {
        heading: { en: 'No moral ranking', zh: '没有道德排名' },
        body: {
          en: 'No archetype is a better person. The families are an editorial map of three axes. They are not discovered personality clusters.',
          zh: '没有哪个原型是更好的人。家族是三条轴的编辑地图。它们不是被发现的人格聚类。',
        },
      },
    ],
  },
  {
    slug: 'contact',
    title: { en: 'Contact', zh: '联系' },
    description: {
      en: 'This static release has no contact form and no inbox.',
      zh: '这个静态版本没有联系表单，也没有收件箱。',
    },
    sections: [
      {
        heading: { en: 'No message is received', zh: '没有信息会被收到' },
        body: {
          en: 'There is no account system and no server waiting for a message. A form that pretended to send mail would be a falsehood. Questions about the method are answered on the methodology page. Questions about privacy are answered on the privacy page.',
          zh: '没有账户系统，也没有服务器在等待一条信息。一个假装会送信的表单是一种虚假。关于方法的问题在方法论页面上回答。关于隐私的问题在隐私页面上回答。',
        },
      },
    ],
  },
];

export function getLegal(slug: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}

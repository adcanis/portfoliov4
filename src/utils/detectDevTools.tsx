export const detectDevToolsShortcut = (event: any) => {
  // For Windows/Linux
  if (
    (event.ctrlKey && event.shiftKey && event.keyCode === 73) ||
    (event.metaKey && event.altKey && event.keyCode === 74) ||
    event.keyCode === 123
  ) {
    const title = "Hi!";
    const styles = `
        color: #F2C94C;
        font-size: 48px;
      `;
    console.log("%c" + title, styles);
    const message =
      "As a creative developer, I'm always looking for new opportunities to collaborate on exciting projects. If you're interested in working together or have questions, please feel free to reach out to me at hey@adcanis.com";
    const messageStyles = `
        font-size: 14px;
        line-height: 1.5;
        width: 75%;
      `;

    console.log("%c" + message, messageStyles);
  }
};

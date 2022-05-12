import React from 'react';

export const withAnalytics = (Component, widgetName) =>
    class extends React.Component {
        sendAnalytics(e) {
            console.log('e.target', e.target);
            console.log('widgetName', widgetName);
            console.log('tag-name', e.target.tagName);
            var element = '';
            if (e.target.tagName === 'svg' || e.target.tagName === 'path') {
                element = 'icon image';
            }

            if (!element && e.target.className) {
                var seperatorIndex = e.target.className.indexOf('-');
                element = e.target.className.slice(0, seperatorIndex);
                console.log('e.target.className', element);
            }

            if (!element && e.target.tagName === 'INPUT') {
                element = `${e.target.tagName}-${e.target.name}-${e.target.value}`;
            }

            if (!element) {
                e.target.childNodes.forEach(node => {
                    if (node && typeof node.nodeValue === 'string') {
                        console.log('node', typeof node);
                        console.log('nodeValue', typeof node.nodeValue);
                        element += node.nodeValue
                    }
                });
                console.log('childNodes', element);
            }

            console.log('final element', element);

            fetch('/interactions', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    element,
                    widget: widgetName,
                    time: String(Date.now()),
                }),
            })
        }

        render() {
            return (
                <div onClick={this.sendAnalytics}>
                    <Component {...this.props} />
                </div>
            );
        }
    }
import * as React from 'react';
import {expect, sinon, ClientRenderer} from 'test-drive-react';
import {disposable} from "../../src/mixins/disposable-decorator";
import {Disposers} from "../../src/utils/disposers";
import {inBrowser} from "mocha-plugin-env/dist/src";


interface Props {
    hook: Function
}

@disposable
class DisposeableComp extends React.Component<Props, any> {

    readonly disposer: Disposers;

    componentDidMount() {
        this.disposer.set('myHook', this.props.hook);
    }

    render() {
        return <div data-automation-id="test"></div>;
    }
}


describe("disposable decorator", () => {
    const clientRenderer = new ClientRenderer();
    afterEach(() => clientRenderer.cleanup());

    it.assuming(inBrowser(), 'only in browser')('called on unmount', () => {
        let sinonSpy = sinon.spy();
        const {container} = clientRenderer.render(<div></div>);

        clientRenderer.render(<div><DisposeableComp hook={sinonSpy}></DisposeableComp></div>, container);
        expect(sinonSpy).to.have.callCount(0);

        clientRenderer.render(<div></div>, container);
        expect(sinonSpy).to.have.callCount(1);
    });
});
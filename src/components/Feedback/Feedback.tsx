interface FeedbackProps {
    tipo: 'sucesso' | 'erro';
    children: string;
}

function Feedback({ tipo, children }: FeedbackProps) {
    return (
        <div className={`app-feedback app-feedback-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
            <i className={`pi ${tipo === 'erro' ? 'pi-exclamation-circle' : 'pi-check-circle'}`} aria-hidden="true" />
            <span>{children}</span>
        </div>
    );
}

export default Feedback;

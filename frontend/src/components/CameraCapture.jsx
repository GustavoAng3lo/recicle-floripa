import { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, ScanLine } from 'lucide-react';

export default function CameraCapture({
  onCapture,
  title = 'Aponte para o material',
  actionLabel = 'Identificar objeto',
  busy = false,
  hasCapture = false,
}) {
  const videoRef = useRef(null);
  const [cameraAtiva, setCameraAtiva] = useState(true);
  const [cameraPronta, setCameraPronta] = useState(false);
  const [cameraErro, setCameraErro] = useState('');
  const [cameraFrontal, setCameraFrontal] = useState(false);

  useEffect(() => {
    if (!cameraAtiva) return undefined;

    const videoElement = videoRef.current;
    let streamAtual;
    let cancelado = false;
    let trackAtiva;
    let aoEncerrarTrack;

    Promise.resolve().then(() => {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Câmera indisponível. Abra o site em HTTPS.');
      }
      return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: cameraFrontal ? 'user' : { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
      });
    }).then((stream) => {
      if (cancelado) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamAtual = stream;
      trackAtiva = stream.getVideoTracks()[0];
      aoEncerrarTrack = () => {
        if (!cancelado) {
          setCameraPronta(false);
          setCameraErro('A conexão com a câmera foi interrompida. Tente ativá-la novamente.');
          setCameraAtiva(false);
        }
      };
      trackAtiva?.addEventListener('ended', aoEncerrarTrack);
      if (!videoElement) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      videoElement.srcObject = stream;
      videoElement.play().catch(() => {});
    }).catch(() => {
      if (!cancelado) {
        setCameraErro('Não foi possível acessar a câmera. Verifique a permissão do navegador.');
        setCameraAtiva(false);
      }
    });

    return () => {
      cancelado = true;
      trackAtiva?.removeEventListener('ended', aoEncerrarTrack);
      streamAtual?.getTracks().forEach((track) => track.stop());
      if (videoElement?.srcObject === streamAtual) {
        videoElement.srcObject = null;
      }
    };
  }, [cameraAtiva, cameraFrontal]);

  const iniciarCamera = () => {
    setCameraErro('');
    setCameraPronta(false);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraErro('Câmera indisponível. Abra o site em HTTPS e permita o acesso à câmera.');
      return;
    }
    setCameraAtiva(true);
  };

  const identificarFrameAtual = () => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) return;

    const escala = Math.min(1, 1024 / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * escala);
    canvas.height = Math.round(video.videoHeight * escala);
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    try {
      let frameCapturado;
      let erroCodificacao;
      for (const formato of ['image/jpeg', 'image/webp', 'image/png']) {
        try {
          const dataUrl = canvas.toDataURL(formato, 0.82);
          const correspondencia = dataUrl.match(/^data:(image\/(?:jpeg|webp|png));base64,(.+)$/);
          if (correspondencia?.[2]) {
            frameCapturado = { mimeType: correspondencia[1], frame: correspondencia[2] };
            break;
          }
        } catch (error) {
          erroCodificacao = error;
        }
      }

      if (!frameCapturado) {
        throw new Error(erroCodificacao?.message || 'O navegador não conseguiu codificar o frame da câmera em JPEG, WebP ou PNG.');
      }

      setCameraErro('');
      onCapture(frameCapturado);
    } catch (error) {
      setCameraErro(error.message || 'Não foi possível ler o frame atual da câmera.');
    }
  };

  const alternarCamera = () => {
    setCameraPronta(false);
    setCameraFrontal((frontal) => !frontal);
  };

  return (
    <section className='camera-capture' aria-label='Câmera ao vivo para identificar material'>
      <div className='camera-viewfinder'>
        {cameraAtiva ? (
          <>
            <video
              ref={videoRef}
              className='camera-live-video'
              autoPlay
              muted
              playsInline
              onCanPlay={() => setCameraPronta(true)}
            />
            <div className='camera-live-label'><span /> AO VIVO</div>
            <div className='camera-focus-frame' aria-hidden='true'><i /><i /><i /><i /></div>
            <p className='camera-live-hint'>{title}</p>
          </>
        ) : (
          <div className='camera-placeholder'>
            <span className='camera-placeholder-icon'><Camera size={25} /></span>
            <strong>{title}</strong>
            <small>Permita o acesso à câmera para identificar o objeto ao vivo</small>
            <button type='button' className='camera-start-button' onClick={iniciarCamera}>
              <Camera size={15} /> Ativar câmera
            </button>
          </div>
        )}
      </div>

      {cameraErro && <p className='camera-error' role='alert'>{cameraErro}</p>}

      <div className='camera-controls'>
        <button type='button' className='camera-secondary-button' onClick={alternarCamera} disabled={!cameraAtiva || busy}>
          <RefreshCw size={15} /> Virar câmera
        </button>
        <button
          type='button'
          className='camera-identify-button'
          onClick={identificarFrameAtual}
          disabled={!cameraPronta || busy}
        >
          <ScanLine size={16} /> {busy ? 'Analisando frame...' : actionLabel}
        </button>
        {hasCapture && <span className='camera-captured-status'><ScanLine size={13} /> Frame pronto</span>}
        {!cameraAtiva && (
          <button type='button' className='camera-secondary-button' onClick={iniciarCamera}>
            <Camera size={15} /> Tentar câmera novamente
          </button>
        )}
      </div>
    </section>
  );
}

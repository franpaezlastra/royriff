import { useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FiXCircle, FiShoppingCart } from 'react-icons/fi';

const PedidoCancelado = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen flex items-center justify-center py-20 bg-primary-beige">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-full p-6 shadow-lg">
            <FiXCircle className="w-20 h-20 text-red-500" />
          </div>
        </div>
        
        <h1 className="font-barlow font-bold text-4xl mb-4 text-neutral-black">
          PEDIDO CANCELADO
        </h1>
        
        <p className="font-neue text-lg text-neutral-darkGreen mb-8">
          Tu pedido ha sido cancelado. No se realizó ningún cargo.
        </p>

        {orderId && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <p className="font-neue text-sm text-neutral-darkGreen">
              <strong className="text-neutral-black">Número de pedido:</strong> {orderId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button to="/carrito" className="inline-flex items-center gap-2">
            <FiShoppingCart className="w-5 h-5" />
            Volver al carrito
          </Button>
          <Button to="/" variant="secondary">
            Volver al inicio
          </Button>
        </div>

        <p className="font-neue text-sm text-neutral-darkGreen mt-8">
          Si tienes alguna pregunta, no dudes en{' '}
          <a href="/contacto" className="text-primary-orange underline hover:no-underline">
            contactarnos
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PedidoCancelado;

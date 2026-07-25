package projetotcc.thiago.PlaySCORE_API.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resourceName, Object resourceId) {
        super(String.format("%s não encontrado com id %s", resourceName, resourceId));
    }
}
